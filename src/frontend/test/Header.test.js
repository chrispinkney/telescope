import React from 'react';

import renderer from 'react-test-renderer';

const DesktopHeader = require('../src/components/Header/DesktopHeader.jsx');

describe('Header', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<DesktopHeader siteTitle="Home" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
