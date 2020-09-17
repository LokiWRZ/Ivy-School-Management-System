#### handlebars
##### dependencies
mongoose
method-override
connect-flash
express
express-session
express-handlebars
body-parser

##### Usage (express-handlebars and mongoose)
<u> express-handlebars does not allow you to specify runtime-options to pass to the template function. This package can help you disable prototype checks for you models. </u>
<p> *** Only do this, if you have full control over the templates that are executed in the server. *** </p>
```js
const express = require('express');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
 
const app = express();
 
app.engine('handlebars', expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');
...
```