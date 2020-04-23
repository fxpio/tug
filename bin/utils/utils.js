/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const fs = require('fs');
const http = require('https');
const os = require('os');
const ini = require('ini');
const crypto = require('crypto');
const childProcess = require('child_process');

module.exports.removeDir = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file){
            let curPath = path + '/' + file;

            if (fs.lstatSync(curPath).isDirectory()) {
                module.exports.removeDir(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(path);
    }
};

/**
 * Replace all occurrence of env variables
 *
 * @param {string} content The content
 * @param {object} [envs]  The environment variables
 *
 * @return {string}
 */
module.exports.replaceVariables = function(content, envs) {
    let reg = /{([A-Z0-9_]+)}/g;
    let m;

    envs = module.exports.mergeVariables(process.env, envs || {});

    do {
        m = reg.exec(content);

        if (m) {
            let envVal = envs[m[1]];

            if (undefined !== envVal) {
                content = content.replace(new RegExp('\{' + m[1] + '\}', 'g'), envVal);
            }
        }
    } while (m);

    return content;
};

/**
 * Read the dot env file.
 *
 * @param {string} path
 *
 * @return {object}
 */
module.exports.readEnvVariables = function(path) {
    if (!fs.existsSync(path)) {
        return {};
    }

    let envStr = fs.readFileSync(path, 'utf8').split("\n");
    let envs = {};

    for (let i = 0; i < envStr.length; ++i) {
        let split = envStr[i].split('=');

        if ('' !== split[0]) {
            envs[split[0]] = '' !== split[1] ? split[1] : null;
        }
    }

    return envs;
};

/**
 * Merge the multiple env variables.
 *
 * @param {object} variables The list of variables
 *
 * @return {object}
 */
module.exports.mergeVariables = function(...variables) {
    let envs = {};

    for (let i = 0; i < variables.length; ++i) {
        let envStack = variables[i];
        let keys = Object.keys(envStack);

        for (let j = 0; j < keys.length; ++j) {
            if (undefined === envs[keys[j]] || null === envs[keys[j]] || null !== envStack[keys[j]]) {
                envs[keys[j]] = envStack[keys[j]];
            }
        }
    }

    return envs;
};

/**
 * Clean the variable value.
 *
 * @param {string|null} value The variable
 *
 * @return {string|null}
 */
module.exports.cleanVariable = function(value) {
    return undefined !== value && '' !== value ? value : null;
};

/**
 * Write the env variables in dot env file.
 *
 * @param {string} path      The path of dot env file
 * @param {object} variables The env variables
 */
module.exports.writeVariables = function(path, variables) {
    let data = '';
    let keys = Object.keys(variables);

    for (let i = 0; i < keys.length; ++i) {
        let val = variables[keys[i]];
        val = null !== val ? val : '';
        data += keys[i] + '=' + val + "\n";
    }

    fs.writeFileSync(path, data);
};

/**
 * Find the AWS credentials in the AWS Shared File.
 *
 * @param {object} [envs] The env variables
 *
 * @return {object}
 */
module.exports.findAwsVariables = function(envs) {
    let pathCredentials = os.homedir() + '/.aws/credentials',
        pathConfig = os.homedir() + '/.aws/config',
        awsCredentials = {},
        awsConfig = {},
        awsAllConfig = {},
        awsEnvs = {};
    envs = envs || {};

    if (fs.existsSync(pathCredentials)) {
        awsCredentials = ini.parse(fs.readFileSync(pathCredentials, 'utf-8'));
    }

    if (fs.existsSync(pathConfig)) {
        awsConfig = ini.parse(fs.readFileSync(pathConfig, 'utf-8'));
    }

    if (undefined !== awsCredentials[envs['AWS_PROFILE']]) {
        awsAllConfig = module.exports.mergeVariables(awsAllConfig, awsCredentials[envs['AWS_PROFILE']]);
    }

    if (undefined !== awsConfig[envs['AWS_PROFILE']]) {
        awsAllConfig = module.exports.mergeVariables(awsAllConfig, awsConfig[envs['AWS_PROFILE']]);
    }

    let keys = Object.keys(awsAllConfig);
    for (let i = 0; i < keys.length; ++i) {
        let name = ((keys[i].startsWith('aws_') ? '' : 'aws_') + keys[i]).toUpperCase();
        awsEnvs[name] = awsAllConfig[keys[i]];
    }

    return awsEnvs;
};

/**
 * Run the external command and replace the env variables by their values.
 *
 * @param {string}   command       The command
 * @param {object}   [envs]        The env variables
 * @param {boolean}  [exitOnError] Exit the process on error
 * @param {boolean}  [verbose]     Display the output of command
 * @param {Object}   [options]     The options of spawn function
 *
 * @return {Promise}
 */
module.exports.spawn = function(command, envs, exitOnError, verbose, options) {
    return new Promise((resolve, reject) => {
        let args = module.exports.replaceVariables(command, envs).split(' ');
        let cmd = args.shift();
        let res = childProcess.spawn(cmd, args, Object.assign({}, {
            shell: true,
            stdio: false === verbose ? 'pipe' : 'inherit'
        }, options || {}));
        let errorData = '';

        if (false === verbose) {
            res.stderr.on('data', function (data) {
                errorData += data.toString();
            });
        }

        res.on('exit', function (code) {
            if ('' !== errorData && false !== verbose) {
                console.info(errorData.replace(/\n$/, ''));
            }

            if (code > 0 && false !== exitOnError) {
                let error = new Error(`The process ended with the error code "${code}"`);
                error.code = code;
                reject(error);
                return;
            }

            resolve(code);
        });
    });
};

/**
 * Run the external command in sync.
 *
 * @param {string} command   The command
 * @param {object} [envs]    The env variables
 * @param {object} [options] The exec options
 *
 * @return {string|null}
 */
module.exports.execSync = function(command, envs, options) {
    let res = null;
    command = module.exports.replaceVariables(command, envs || {});

    try {
        let resCmd = childProcess.execSync(command, Object.assign({
            stdio : [null, null, null]
        }, options || {})).toString().trim();

        if (typeof resCmd === 'string' && resCmd.length > 0) {
            res = resCmd;
        }
    } catch (e) {}

    return res;
};

/**
 * Validate the required option.
 *
 * @param {*}              value     The option value
 * @param {string|boolean} [message] The error message
 *                                   false to display the default error message
 *                                   undefined to display the custom default message
 *
 * @return {string|boolean}
 */
module.exports.requiredOption = function(value, message) {
    if (undefined === value || null === value || (typeof value === 'string' && 0 === value.length)) {
        return undefined !== message ? message : 'This option is required';
    }

    return true;
};

/**
 *
 * @param {commander.Command} program The command of commander
 * @param {object}            envs    The env variables
 * @param {string}            envName The required environment variable
 * @return {boolean}
 */
module.exports.showOnlyEmptyOption = function(program, envs, envName) {
    return true !== program.onlyEmpty || (true === program.onlyEmpty && null === envs[envName]);
};

/**
 * Check if 2 objects are same.
 *
 * @param {object} object1 The first object
 * @param {object} object2 The second object
 *
 * @return {boolean}
 */
module.exports.isSameObject = function(object1, object2) {
    let keys1 = Object.keys(object1),
        keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let i = 0; i < keys2.length; ++i) {
        if (object1[keys2[i]] !== object2[keys2[i]]) {
            return false;
        }
    }

    return true;
};

/**
 * Get the checksum of file.
 *
 * @param {string} path        The path of file
 * @param {string} [algorithm] The crypto algorithm
 *
 * @return {Promise}
 */
module.exports.checksumFile = function(path, algorithm) {
    algorithm = algorithm || 'sha1';

    return new Promise((resolve, reject) => {
        fs.createReadStream(path)
            .on('error', reject)
            .pipe(crypto.createHash(algorithm).setEncoding('hex'))
            .once('finish', function () {
                resolve(this.read());
            });
    });
};

/**
 * Replace the antislash by slash.
 *
 * @param {string} str The string
 *
 * @return {string}
 */
module.exports.fixWinSlash = function(str) {
    return str.replace(/\\/g, '/');
};

/**
 * Retry the function.
 *
 * @param {function} fn     The function
 * @param {function} [prev] The previous function
 *
 * @return {Promise}
 */
module.exports.retryPromise = function(fn, prev) {
    return new Promise((current) => {
        let resolve = () => (prev && prev()) || current();

        fn(resolve, delay => {
            setTimeout(() => {
                return module.exports.retryPromise(fn, resolve);
            }, delay);
        });
    });
};

/**
 * Download the file.
 *
 * @param {string} url  The URL of file
 * @param {string} dest The local destination
 *
 * @return {Promise<any>}
 */
module.exports.downloadFile = function(url, dest) {
    return new Promise((resolve, reject) => {
        let responseSent = false;

        http.get(url, response => {
            if (200 === response.statusCode) {
                let file = fs.createWriteStream(dest);

                response.pipe(file);
                file.on('finish', () => {
                    file.close(() => {
                        if(responseSent) {
                            return;
                        }

                        responseSent = true;
                        resolve();
                    });
                });
            } else {
                reject('Response status was ' + response.statusCode + ' ' + response.statusMessage);
            }
        }).on('error', err => {
            if(responseSent) {
                return;
            }

            responseSent = true;
            reject(err);
        });
    });
};

/**
 * Generate a pseudo id.
 *
 * @param {Number} [size] The size of id
 *
 * @return {string}
 */
module.exports.generateId = function(size) {
    let ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = '';
    size = size || 10;

    for (let i = 0; i < size; i++) {
        id += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }

    return id;
};

/**
 * Helper to catch and display the error.
 *
 * @param {object} e The error
 */
module.exports.displayError = function(e) {
    console.error('Error:', undefined !== e.message ? e.message : e);
    process.exit(1);
};
