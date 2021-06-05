var React = require('react');

var styles = {"test":"_3ybTi"};

var LiveKitRoom = function LiveKitRoom(props) {
  console.log(props.url);
  return React.createElement("div", null);
};

var ExampleComponent = function ExampleComponent(_ref) {
  var text = _ref.text;
  return React.createElement("div", {
    className: styles.test
  }, "Example Component: ", text);
};

exports.ExampleComponent = ExampleComponent;
exports.LiveKitRoom = LiveKitRoom;
//# sourceMappingURL=index.js.map
