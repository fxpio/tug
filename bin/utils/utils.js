/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const fs = require('fs');
const os = require('os');
const ini = require('ini');
const childProcess = require('child_process');

function removeDir(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
            let curPath = path + '/' + file;

            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(path);
    }
}

/**
 * Replace all occurrence of env variables
 *
 * @param {string} content The content
 * @param {object} [envs]  The environment variables
 *
 * @return {string}
 */
function replaceVariables(content, envs) {
    let reg = /\{([A-Z0-9_]+)\}/g;
    let m;

    envs = mergeVariables(process.env, envs || {});

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
}

/**
 * Read the dot env file.
 *
 * @param {string} path
 *
 * @return {object}
 */
function readEnvVariables(path) {
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
}

/**
 * Merge the multiple env variables.
 *
 * @param {object} variables The list of variables
 *
 * @return {object}
 */
function mergeVariables(...variables) {
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
}

/**
 * Clean the variable value.
 *
 * @param {string|null} value The variable
 *
 * @return {string|null}
 */
function cleanVariable(value) {
    return undefined !== value && '' !== value ? value : null;
}

/**
 * Write the env variables in dot env file.
 *
 * @param {string} path      The path of dot env file
 * @param {object} variables The env variables
 */
function writeVariables(path, variables) {
    let data = '';
    let keys = Object.keys(variables);

    for (let i = 0; i < keys.length; ++i) {
        let val = variables[keys[i]];
        val = null !== val ? val : '';
        data += keys[i] + '=' + val + "\n";
    }

    fs.writeFileSync(path, data);
}

/**
 * Find the AWS variables in the config of AWS CLI.
 *
 * @param {object} [envs] The env variables
 *
 * @return {object}
 */
function findAwsVariables(envs) {
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
        awsAllConfig = mergeVariables(awsAllConfig, awsCredentials[envs['AWS_PROFILE']]);
    }

    if (undefined !== awsConfig[envs['AWS_PROFILE']]) {
        awsAllConfig = mergeVariables(awsAllConfig, awsConfig[envs['AWS_PROFILE']]);
    }

    let keys = Object.keys(awsAllConfig);
    for (let i = 0; i < keys.length; ++i) {
        let name = ((keys[i].startsWith('aws_') ? '' : 'aws_') + keys[i]).toUpperCase();
        awsEnvs[name] = awsAllConfig[keys[i]];
    }

    return awsEnvs;
}

/**
 * Run the external command and replace the env variables by their values.
 *
 * @param {string}   command       The command
 * @param {object}   [envs]        The env variables
 * @param {function} [callback]    The callback
 * @param {boolean}  [exitOnError] Exit the process on error
 * @param {boolean}  [verbose]     Display the output of command
 *
 * @return {boolean|object}
 */
function runCommand(command, envs, callback, exitOnError, verbose) {
    let args = replaceVariables(command, envs).split(' ');
    let cmd = args.shift();
    let res = childProcess.spawn(cmd, args, {
        stdio: false === verbose ? 'pipe' : 'inherit'
    });
    let errorData = '';

    if (false === verbose) {
        res.stderr.on('data', function (data) {
            errorData += data.toString();
        });
    }

    res.on('exit', function (code) {
        if ('' !== errorData) {
            console.log(errorData.replace(/\n$/, ''));
        }

        if (code > 0 && false !== exitOnError) {
            process.exit(code);
        }

        if (typeof callback === 'function') {
            callback(code);
        }
    });
}

/**
 * Run the external command in sync.
 *
 * @param {string} command The command
 * @param {object} [envs]  The env variables
 *
 * @return {string|null}
 */
function execSync(command, envs) {
    let res = null;
    command = replaceVariables(command, envs || {});

    try {
        let resCmd = childProcess.execSync(command, {
            stdio : [null, null, null]
        }).toString().trim();

        if (typeof resCmd === 'string' && resCmd.length > 0) {
            res = resCmd;
        }
    } catch (e) {}

    return res;
}

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
function requiredOption(value, message) {
    if (undefined === value || null === value || (typeof value === 'string' && 0 === value.length)) {
        return undefined !== message ? message : 'This option is required';
    }

    return true;
}

/**
 *
 * @param {commander.Command} program The command of commander
 * @param {object}            envs    The env variables
 * @param {string}            envName The required environment variable
 * @return {boolean}
 */
function showOnlyEmptyOption(program, envs, envName) {
    return true !== program.onlyEmpty || (true === program.onlyEmpty && null === envs[envName]);
}

/**
 * Check if 2 objects are same.
 *
 * @param {object} object1 The first object
 * @param {object} object2 The second object
 *
 * @return {boolean}
 */
function isSameObject(object1, object2) {
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
}

module.exports = {
    removeDir: removeDir,
    replaceVariables: replaceVariables,
    readEnvVariables: readEnvVariables,
    mergeVariables: mergeVariables,
    cleanVariable: cleanVariable,
    findAwsVariables: findAwsVariables,
    writeVariables: writeVariables,
    exec: runCommand,
    execSync: execSync,
    requiredOption: requiredOption,
    showOnlyEmptyOption: showOnlyEmptyOption,
    isSameObject: isSameObject
};
