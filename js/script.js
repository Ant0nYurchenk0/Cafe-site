$(function () { 
  $("#collapse-menu-btn").blur(function (event){
    $("#menu-items").collapse('hide');
  });

  $("#collapse-menu-btn").click(function (event) {
    $(event.target).focus();
    console.log("focus forced");
    
  });

});

(function (global) {

var zwc = {};

var homeHtml = "snippets/home.html";
var newsTitleHtml = "snippets/home_news-title.html";
var newsTitles = "data/news-titles.json"

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/loader.gif'></div>";
  insertHtml(selector, html);
};
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
}
var insertNews = function(selector){
  var targetElement = selector;
  global.$ajaxUtils.sendGetRequest(
    newsTitles,
    function(newsArray){
      showLoading(targetElement);
      global.$ajaxUtils.sendGetRequest(
        newsTitleHtml,
        function (responseHtml) {
          var newsHtmlList = "";
          for (var i = 0; i < newsArray.length; i++){
            var emptyHtml = responseHtml;      
            for (const property in newsArray[i]){
              emptyHtml = insertProperty(emptyHtml, property, newsArray[i][property]);
            }
            newsHtmlList += emptyHtml;
          }
          insertHtml(targetElement, newsHtmlList);
        },
        false);
    },
    true
  )
}

// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {
  // On first load, show home view
  showLoading("#main-content");
  global.$ajaxUtils.sendGetRequest(
    homeHtml,
    function (responseText) {
      document.querySelector("#main-content")
      .innerHTML = responseText;
    },
    false);
    insertNews("#news");
  });
  
  zwc.loadNews = function(){
    showLoading("#main-content");
  }
  console.log(zwc);
  
  global.$zwc = zwc;
  
  
})(Window);