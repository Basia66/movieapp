function csvJSON(csv) {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(";");
    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(";");
        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }

    return JSON.stringify(result);
}

function appendRecord(el) {
    var node = document.createElement("a");
    var textnode = document.createTextNode(el["title"]);
    node.appendChild(textnode);
    node.href = "movie_page.html?id=" + el["movie_id"];
    document.getElementById("result").appendChild(node);
    document.getElementById("result").appendChild(document.createElement("br"));
}   

function sortA(x, c) {
    const createLunrIndex = docs =>
    lunr(function () {
        this.ref('movie_id');
        this.field('title');
        this.field('genre');
        this.field('description');
        for (doc of docs) this.add(doc);
    });

    const search = (lunrIndex, term) =>
    lunrIndex.search(term).map(res => res.ref)
        
    const gamesIndex = createLunrIndex(x);
    var resSet = search(gamesIndex, c);

    for (let index = 0; index < resSet.length; index++) {
        const element = resSet[index];
        for (let j = 0; j < x.length; j++) {
            if (element == x[j]["movie_id"])
            {
                appendRecord(x[j]);
            }
        }
    }
}

function search() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var c = url.searchParams.get("search_query");
    
    fetch("movies.csv")
        .then(x => x.text())
        .then(x => JSON.parse(csvJSON(x)))
        .then(x => sortA(x, c))
}

function init_movie() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var c = url.searchParams.get("id");

    fetch("movies.csv")
        .then(x => x.text())
        .then(x => JSON.parse(csvJSON(x)))
        .then(x =>  {
            var movie = undefined;
            for (let j = 0; j < x.length; j++) {
                if (c == x[j]["movie_id"])
                {
                    movie = x[j];
                }
            }

            document.getElementsByClassName("poster_img")[0].src = movie["poster"];
            document.getElementsByClassName("title")[0].innerHTML = movie["title"];
            document.getElementsByClassName("genre")[0].innerHTML = movie["genre"];
            document.getElementsByClassName("desc")[0].innerHTML = movie["description"];
            document.getElementsByClassName("poster_img")[0].innerHTML = movie["poster"];
        })
}