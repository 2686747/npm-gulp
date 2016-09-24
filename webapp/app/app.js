import Inferno from 'inferno';
import InfernoDom from 'inferno-dom';

(function() {

    'use strict';

    const message = "Hello world";
    console.debug('InfernoDom', InfernoDom);
    InfernoDom.render( <div message = {message}>here works inferno:{message} - as re11l12</div>,
        document.getElementById("app")
    );

})();
