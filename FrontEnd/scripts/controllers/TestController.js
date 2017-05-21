myApp.controller('TestController', ['$scope', '$http', 'localStorageFactory', function($scope, $http, localStorageFactory){
    $scope.language = "english";
    $scope.clusters = [];

    $scope.getEmails = function(){
        $http({url: 'http://localhost:10167/api/main/getEmail',
            method: 'get',
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        })
            .success(function(data){
                $scope.emails = data;
                $scope.processData();
                console.log(data);
            })
            .error(function(data){
                console.log(data);
            });
    }();

    $scope.Stem = function(word) {
        var testStemmer = new Snowball($scope.language);
        testStemmer.setCurrent(word);
        testStemmer.stem();
        return testStemmer.getCurrent();
    };

    $scope.processData = function(){
        $scope.clusters[0] = []; //initially only one cluster

        for(var index in $scope.emails)
        {
            var email = $scope.emails[index];
            var emailContent = email["Content"];

            var dictionary = $scope.processRawMessage(emailContent);

            $scope.clusters[0].push(dictionary);
        }

        // var d1 = {"ant" : 2, "bee" : 1};
        // var d2 = {"ant" : 1, "bee": 1, "dog": 4, "hog": 1};
        // var d3 = {"cat": 1, "dog" : 1, "eel" : 1, "fox" : 1, "gnu": 1};
        //
        // console.log("document similarity: " +  $scope.similarityBetweenDocuments(d3, d2));
       $scope.clusters = $scope.bisectingKMeansAlg($scope.clusters, 30);

        //a new email is coming

        localStorageFactory.set("clusters", JSON.stringify($scope.clusters));
    };

    /*
    * Receive a message and returns a dictionary with containing
    * words and their frequency after removing stop words and
    * stemming words
    * */
    $scope.processRawMessage = function(message){
        var dictionary = {};
        var wordsRegex = /\b[^\d\W]+\b/g;

        var words = message.match(wordsRegex);

        // remove stop words
        var beforeRemovingStopWords = words.join(" ");
        var bar = beforeRemovingStopWords.removeStopWords();
        var words = bar.split(" ");

        for(var wordIndex in words)
        {
            var word = words[wordIndex].replace(/[^a-zA-Z0-9 ]/g,"").toLowerCase();
            // stemming words
            word = $scope.Stem(word);
            if(dictionary.hasOwnProperty(word))
            {
                dictionary[word] = dictionary[word] + 1;
            }
            else
            {
                dictionary[word] = 1;
            }
        }

        return dictionary;
    };

    /*
    * Find the cluster most 'similar' and add it to that cluster
    * */
    $scope.processNewIncomingMessage = function(doc){
        var similarities = [];
        //calculate the similarity from the document to each cluster
        for(var index in $scope.clusters){
            var similarity = $scope.similarityFromDocumentToCluster(doc, $scope.clusters[index]);
            similarities.push(similarity);
        }

        //find the most 'similar' cluster
        var greatestIndex  = _.indexOf(similarities, _.max(similarities));

        //add the document to the cluster
        $scope.clusters[greatestIndex] = $scope.dictionaryIntersection(doc, $scope.clusters[greatestIndex]);
    };

    /*
    * Similarity between 2 documents is given by: cosine angle
    * cos(d1, d2) = d1 ** d2 / (|d1| * |d2|)
    * |d| = length of d1 vector;
    * ** = inner(dot) product:
    *       d1 ** d2 = x11*x21 + x12*x21 + x13*x23 + ... + x1n*x2n
    *  @Return decimal value
    * */
    $scope.similarityBetweenDocuments = function(doc1, doc2) {
        //doc1, doc2 sunt dictionare cu frecventa aparitiei cuvintelor
        var d1Length = $scope.getDocumentSize(doc1);
        var d2Length = $scope.getDocumentSize(doc2);

        var intersectionKeys = $scope.dictionaryIntersection(doc1, doc2);

        var dotProduct = 0;

        for(var key in intersectionKeys){
            dotProduct += doc1[intersectionKeys[key]] * doc2[intersectionKeys[key]];
        }

        return dotProduct / ( d1Length * d2Length );
    };

    /*
    * @Return decimal value
    * cluster is a list of dictionaries
    * */
    $scope.similarityFromDocumentToCluster = function(doc, cluster){
        if(cluster.length == 1)
        {
            return $scope.similarityBetweenDocuments(doc, cluster[0])
        }

        var clusterDocuments  = {};
        for(var document in cluster){
            _.extend(clusterDocuments, cluster[document]);
        }
        return $scope.similarityBetweenDocuments(doc, clusterDocuments);
    };

    /*
    * Returns the dictionaryIntersection of 2 dictionaries with words and their
    * frequency
    * */
    $scope.dictionaryIntersection = function(dict1, dict2){
        return Object.keys(dict1).filter({}.hasOwnProperty.bind(dict2));
    };

    /*$scope.dictionaryIntersection = function (o1, o2) {
        return Object.keys(o1).concat(Object.keys(o2)).sort().reduce(function (r, a, i, aa) {
            if (i && aa[i - 1] === a) {
                r.push(a);
            }
            return r;
        }, []);
    };*/
    $scope.getDocumentSize = function(documentDictionary) {
        var sum = 0;
        for(var w in documentDictionary){
            sum += Math.pow(documentDictionary[w], 2);
        }
        return Math.sqrt(sum);
    };

    /*
    * Initial cluster contains all documents
    * Step 1: Pick a cluster to split
    * Step 2: Find _2_ sub-clusters using the basic k means algorithm (Bisecting step)
    * Step 3: Repeat step 2 for ITER times and take the split that produces the clustering
    *         with the highest overall similarity
    * Step 4: Repeat steps 1, 2, 3 until the desired number of clusters is reached
    * */
    $scope.bisectingKMeansAlg = function(initialCluster, numberOfClustersToObtain){

        var clusters = [initialCluster[0]];

        for(var i = 0; i < numberOfClustersToObtain - 1; i++){
           var largestCluster = _.maxBy(clusters, _.size);
           //delete largestCluster from the list of clusters
           clusters = _.without(clusters, largestCluster);

           var bisectedClusters = $scope.bisectingStep(largestCluster);
           var cluster1 = bisectedClusters[0];
           var cluster2 = bisectedClusters[1];

           //add the bisecting resulted clusters
           clusters.push(cluster1);
           clusters.push(cluster2);
        }
        return clusters;
    };

    /*
    * Bisecting a cluster with kMeans basic algorithm:
    * - choose 2 random points as initial cluster
    * - assign each document remaining to the closest cluster.
    * */
    $scope.bisectingStep = function(clusterToBisect){

        if(clusterToBisect.length == 2){
            return [clusterToBisect[0], clusterToBisect[1]]
        }

        var idx1 = Math.floor(Math.random() * clusterToBisect.length);
        var idx2 = Math.floor(Math.random() * clusterToBisect.length);

       // console.log("cluster length:" + clusterToBisect.length);
       // console.log("initial index for c1: " + idx1 + " values: " + JSON.stringify(clusterToBisect[idx1]));
       // console.log(" and c2: " + idx2 + " values: " + JSON.stringify(clusterToBisect[idx2]));

        var cluster1 = [clusterToBisect[idx1]];
        var cluster2 = [clusterToBisect[idx2]];

        //remove from array initial clusters
        clusterToBisect.splice(idx1, 1);
        clusterToBisect.splice(idx2, 1);

        for(var document in clusterToBisect){
            //find similarity from document to each cluster
            var similarityToCluster1 = $scope.similarityFromDocumentToCluster(clusterToBisect[document], cluster1);
            var similarityToCluster2 = $scope.similarityFromDocumentToCluster(clusterToBisect[document], cluster2);

            if(similarityToCluster1 > similarityToCluster2){
                cluster1.push(clusterToBisect[document]);
            }else{
                cluster2.push(clusterToBisect[document]);
            }
        }
        return [cluster1, cluster2];
    };
}]);
