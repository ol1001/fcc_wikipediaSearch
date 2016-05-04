$(document).ready(function () {
    var userInput = $('#userInput');

    $("button").hover(function () {
        $(this).addClass('animated tada');
    }, function () {
        $(this).removeClass('animated tada');
    });

    $("button").click(function () {
        var toSearch = $('input').val(),
            actionType;

        if (this.id == "search") {
            actionType = "search";
        } else {
            actionType = "random";
            $('input').val(' ');
        }

        ajaxWikiArticle(actionType, toSearch);

    });

    $('body').keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13' && userInput.val() != "") {
            ajaxWikiArticle("search", userInput.val());
        }
    });

});

var ajaxWikiArticle = function (actionType, toSearch) {
    var articlesWrapper = $('.articlesWrapper'),
        loadingStste = $('.loadingState');

    articlesWrapper.empty();
    loadingStste.css("display", "block");

    $.ajax({
        url: '//en.wikipedia.org/w/api.php',
        data: {
            //main parameters
            action: 'query',
            format: 'json',

            //parameters for generator
            generator: actionType,
            gsrsearch: toSearch,
            gsrlimit: 50,
            grnnamespace: 0,
            grnlimit: 1,

            prop: 'extracts|pageimages|info',

            //parameters for extracts
            exchars: 200,
            exlimit: 'max',
            explaintext: true,
            exintro: true,

            //parameters for pageimages
            piprop: 'thumbnail',
            pilimit: 'max',
            pithumbsize: 200,

            //parameters for info
            inprop: 'url'
        },
        dataType: 'jsonp',

        success: function (json) {
            loadingStste.css("display", "none");

            if (json.query) {
                var pages = json.query.pages;
                console.log(Object.keys(pages).length);

                $.map(pages, function (page) {
                    var pageElement = $('<div class="article">'),
                        emptyImg = $('<div class="emptyImg"><i class="fa fa-image fa-3x" aria-hidden="true"></i>'),
                        articleTitle = $('<h2>').text(page.title),
                        articleClearfix = $('<div class="clearfix">'),
                        articleAbstract;

                    if (page.extract) {
                        articleAbstract = $('<p>').html(page.extract + '<a href="' + page.fullurl + '" target="_blank"><i class="fa fa-angle-right fa-lg" aria-hidden="true"></i></a>');
                    } else {
                        articleAbstract = $('<p>').html('<a href="' + page.fullurl + '" target="_blank">Read on wikipedia</a>');
                    }

                    if (page.thumbnail) {
                        var articleImg = $('<img>').attr('src', page.thumbnail.source);
                        pageElement.append(articleImg);
                    } else {
                        pageElement.append(emptyImg);
                    }

                    pageElement.append(articleTitle, articleAbstract, articleClearfix);

                    articlesWrapper.append(pageElement);
                });
            } else {
                alert("There is no entry regarding with this query");
            }
        }
    });

}
