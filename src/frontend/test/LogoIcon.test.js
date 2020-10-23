import React from 'react';
import { render } from '@testing-library/react';

// You have to write data-testid
const Title = () => <h1 data-testid="hero-title">Gatsby is awesome!</h1>;

test('Displays the correct title', () => {
  const { getByTestId } = render(<Title />);
  // Assertion
  expect(getByTestId('hero-title')).toHaveTextContent('Gatsby is awesome!');
  // --> Test will pass
});

// import React from 'react';
// import { render } from 'react-dom';

// import renderer from 'react-test-renderer';

// const DesktopHeader = require('../src/components/LogoIcon/LogoIcon.jsx');

// test('temp', () => {
//   expect(true).toBe(true);
// });

// // test('subscribe renders first name and email', () => {
// //   const { getByLabelText, debug } = render(<DesktopHeader />);

// // });

// describe('Header', () => {
//   // it('renders correctly', () => {
//   //   const tree = renderer.create(<DesktopHeader siteTitle="Home" />).toJSON();
//   //   expect(tree).toMatchSnapshot();
//   // });
//   const wrapper = shallow(<DesktopHeader />);
//   //const welcome =
//   //expect(wrapper.contains(welcome)).toEqual(true);
// });
