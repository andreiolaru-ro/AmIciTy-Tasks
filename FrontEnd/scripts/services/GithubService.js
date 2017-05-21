myApp.service('GitHubService', ['$http', '$q', function ($http, $q) {
    var gitToken = '';//TODO
    var profileData = {};
    var repositories = {};

    this.getProfile = function () {
        var def = $q.defer();
        $http({
            url: 'https://api.github.com/user?access_token=' + gitToken,
            method: 'GET'
        })
            .success(function (response) {
                profileData = response;
                def.resolve(response);
            })
            .error(function (response) {
                def.reject("Github: Failed to get user profile");
            });
        return def.promise;
    };

    this.getRepositories = function () {
        var repoURL = profileData["repos_url"];
        var def = $q.defer();
        $http({
            url: repoURL,
            method: 'GET'
        })
            .success(function (response) {
                repositories = response;
                def.resolve(response);
            })
            .error(function (repos) {
                def.reject("Failed to get repositories");
            });
        return def.promise;
    };

    this.getIssueObject = function (numberOfIssues, repoURL) {
        var issues = [];

        for (i = 1; i <= numberOfIssues; i++) {
            var url = repoURL + '/issues/' + i;
            $http({
                url: url,
                method: 'GET'
            })
                .success(function (response) {
                    issues.push(
                        {
                            issue_name: response.title,
                            updated_at : response.updated_at
                        });
                })
                .error(function (repos) {
                    console.log("error in retrieving issue objects");
                });
        }
        return issues;
    };

    this.createOpenIssuesList = function(githubIssues) {
        for (var i = 0; i < repositories.length; i++) {
            var repo = repositories[i];
            if (repo.open_issues > 0) {
                console.log("repository: " + repo.name + " has issues " + repo.has_issues);
                var issue = this.getIssueObject(repo.open_issues, repo.url); //repo.issues_url
                githubIssues.push(issue);
            }
        }
    };
}]);