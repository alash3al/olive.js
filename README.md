# olive.js
a lightweight micro javascript web application framework .


# Usage
```html
<!DOCTYPE HTML>
<html>
  <head>
    <title>Olive - Hello world</title>
  </head>
  <body>
    <script src="/path/to/olive.js"></script>
    <script>
      // initialize olive
      // and [optionally] run a callback 'on window load'
      // using this feature is recommended :)
      Olive(function(){
      
        // olive automatically create a global vars 'olive' and 'Olive'
        // so you can easily call it from anywhere
        // also 'this' referes to "Olive" instance
        // lets do some configs !

        // 1)- whether you want to use "hash" or "pushState" ?
        // ----> default is "auto", it will automatically detect the right setting
        this.config = "hash"

        // 2)- set the base of the application
        // ----> lets say that your app is at '/htdocs/myapp/'
        // ----> so when you access it 'http://mysite.com/myapp/'
        // ----> so the base will be "myapp"
        // ----> default is "/"
        this.base = "/"

        // 3)- set the current filename
        // ---> lets say that your app's filename is 'index.html'
        // ---> so this value will be 'index.html'
        // ---> default "index.html"
        this.filename = "index.html"

        // lets handle "/" page ?
        this.on("/", function(){
          alert("Welcome to index")
        })

        // handle with custom regex ?
        // -> handle '/page/<any char>'
        this.on("/page/([^\/]+)", function(page){
          alert("We are in " + page)
        })

        // more regex ?
        this.on("/user/([^\/]+)/post/([^\/]+)", function(user, post){
          alert("User: " + user + ", Post: " + post)
        })

        // simple templating ?
        var mytpl = "<h1>First name: {{fname}}, Last name: {{lname}}</h1>"
        var mytplCompiled = this.tpl(mytpl, {
          fname: "Mohammed",
          lname: "Al Ashaal"
        })

        // a jQuery like selector "using querySelector[all]"
        // here it will return a single value not array
        // we will fetch the html of the element
        var simpleDiv = this.select("#simpleDiv").innerHTML

        // but here will tell the o.live.select() to return array of matched elements
        var simpleClasses = this.select(".simpleClasses")[0].innerHTML

        // redirect to an internal path ?
        // it will automatically normalize it based on 'hash' or 'pushState'
        // we have set in 'config.use'
        this.go("/user/tst")

        // Run all routes, this is used by 'window.onhashchange' & 'window.onpopstate'
        // and automatically run in the 'window.onload'
        // you don't need to call it
        this.dispatch()

        // get the current path in the browser ?
        this.path

        // want the query ?
        this.query
  
        // now go aheadn and try it your self :)
      })
    </script>
  </body>
</html>
```
