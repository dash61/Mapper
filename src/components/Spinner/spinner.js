/* Taken (and then changed a bit) from:
  https://github.com/chenglou/react-spinner/blob/master/index.jsx
  Main file (index.jsx) of the react-spinner project of Cheng Lou.
*/

import React from 'react';
import "./spinner.css";

class Spinner extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let bars = [];
    const props = this.props;

    for (let i = 0; i < 12; i++) {
      let barStyle = {};
      barStyle.WebkitAnimationDelay = barStyle.animationDelay =
        (i - 12) / 10 + 's';

      barStyle.WebkitTransform = barStyle.transform =
        'rotate(' + (i * 30) + 'deg) translate(166%)';

      barStyle.backgroundColor = props.barbackgroundcolor;

      barStyle.zIndex = 1000; // override default so it appears on top of map
      barStyle.width = '40%'; // override css file value so spinner is larger

      bars.push(
        <div style={barStyle} className="react-spinner_bar" key={i} />
      );
    }

    return (
      <div {...props} className={(props.className || '') + ' react-spinner'}>
        {bars}
      </div>
    );
  }
};

export default Spinner;
