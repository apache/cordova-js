
module.exports = function computeCommitId(callback, cachedGitVersion) {

    if (cachedGitVersion) {
        callback(cachedGitVersion);
        return;
    }

    var versionFileId = fs.readFileSync('VERSION', { encoding: 'utf8' }).trim();
    
    if (/-dev$/.test(versionFileId) && fs.existsSync('.git')) {
        var gitPath = 'git';
        var args = 'rev-list HEAD --max-count=1 --abbrev-commit';
        childProcess.exec(gitPath + ' ' + args, function(err, stdout, stderr) {
            var isWindows = process.platform.slice(0, 3) == 'win';
            if (err && isWindows) {
                gitPath = '"' + path.join(process.env['ProgramFiles'], 'Git', 'bin', 'git.exe') + '"';
                childProcess.exec(gitPath + ' ' + args, function(err, stdout, stderr) {
                    if (err) {
                        error(err);
                    } else {
                        done(versionFileId + '-' + stdout);
                    }
                });
            } else if (err) {
                error(err);
            } else {
                done(versionFileId + '-' + stdout);
            }
        });
    } else {
        done(fs.readFileSync('VERSION', { encoding: 'utf8' }));
    }

    function error(err) {
        throw new Error(err);
    }

    function done(stdout) {
        var version = stdout.trim();
        cachedGitVersion = version;
        callback(version);
    };
}
