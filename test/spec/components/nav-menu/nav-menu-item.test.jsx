import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import NavMenuItem from 'components/nav-menu/nav-menu-item';
import NavMenuList from 'components/nav-menu/nav-menu-list';

import testData from 'sample-data/nested.json';

const testSuite = testData.suites.suites[0];

chai.use(chaiEnzyme());

describe('<NavMenuItem />', () => {
  let props;

  const getInstance = instanceProps => {
    const wrapper = mount(<NavMenuItem { ...instanceProps } />);
    return {
      wrapper,
      links: wrapper.find('.nav-menu-link span'),
      navList: wrapper.find(NavMenuList),
      disabledLinks: wrapper.find('.nav-menu-disabled')
    };
  };

  beforeEach(() => {
    props = {
      showPassed: true,
      showFailed: true,
      showPending: true,
      showSkipped: true
    };
  });

  it('should render', () => {
    const testProps = Object.assign({}, props, {
      suite: testSuite
    });
    const { links, navList, disabledLinks } = getInstance(testProps);
    expect(navList).to.have.lengthOf(3);
    expect(links).to.have.lengthOf(6);
    expect(disabledLinks).to.have.lengthOf(0);
    expect(links.first().text()).to.equal('Nesting Suites');
  });

  it('should render disabled when toggles are off', () => {
    const testProps = Object.assign({}, {
      showPassed: false,
      showFailed: false,
      showPending: false,
      showSkipped: false
    }, {
      suite: testSuite
    });
    const { links, navList, disabledLinks } = getInstance(testProps);
    expect(navList).to.have.lengthOf(3);
    expect(links).to.have.lengthOf(6);
    expect(disabledLinks).to.have.lengthOf(6);
    expect(links.first().text()).to.equal('Nesting Suites');
  });

  it('should render uuid as title when suite title is empty', () => {
    const newSuite = Object.assign({}, testSuite, {
      title: ''
    });
    const testProps = Object.assign({}, props, {
      suite: newSuite
    });
    const { links, navList } = getInstance(testProps);
    expect(navList).to.have.lengthOf(3);
    expect(links).to.have.lengthOf(6);
    expect(links.first().text()).to.equal('1c7a4f0b-e73f-4cec-849f-b3343e047d36');
  });
});
