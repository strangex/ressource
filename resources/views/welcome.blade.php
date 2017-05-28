<html lang="en">

    <head>
        <link rel="icon" href="img/icon.jpg" type="image/jpg">
        @include('partials._commonStyles')
        @include('partials._commonScripts')
    
    </head>

    <body ng-app='articlesApp'>   
       <div ui-view></div>     
    </body>

        <script src='scripts/core.js'></script>
        <script src='scripts/home.js'></script>
        <script src='scripts/dash.js'></script>
</html>