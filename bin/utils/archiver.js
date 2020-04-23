/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

/**
 * Archive the content.
 *
 * @param {string}   srcPath The path of the content to be archived
 * @param {string}   toPath  The path of archive file
 *
 * @return Promise
 */
module.exports.archive = function archive(srcPath, toPath) {
    return new Promise((resolve, reject) => {
        let outputDir = path.dirname(toPath);

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        let output = fs.createWriteStream(toPath);
        let archive = archiver('zip', {
            zlib: { level: 9 }
        });

        if (!fs.existsSync(srcPath)) {
            reject(`The content source path "${srcPath}" does not exist`);
            return;
        }

        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
                console.warn(err.toString());
            } else {
                reject(err);
            }
        });

        archive.on('error', function(err) {
            reject(err);
        });

        output.on('close', function() {
            console.info('Package archive is created successfully (' + archive.pointer() + ' bytes)');
            resolve(toPath);
        });

        archive.pipe(output);
        archive.directory(srcPath, '');
        archive.finalize();
    });
};
