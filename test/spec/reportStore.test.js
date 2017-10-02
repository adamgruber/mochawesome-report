import { expect } from 'chai';
import { ReportStore } from 'js/reportStore';
import testData from 'sample-data/nested.json';

describe('ReportStore', () => {
  let store;

  beforeEach(() => {
    store = new ReportStore();
  });

  it('has the correct default state', () => {
    expect(store).to.include({
      sideNavOpen: false,
      showPassed: true,
      showFailed: true,
      showPending: true,
      showSkipped: false,
      showHooks: 'failed'
    });
  });

  describe('setInitialData', () => {
    it('without config options', () => {
      store.setInitialData({
        data: testData,
        config: {}
      });
      expect(store).to.have.property('data', testData);
      expect(store).to.have.property('reportTitle', undefined);
      expect(store).to.have.property('stats', testData.stats);
      expect(store).to.have.deep.property('allSuites[0]', testData.suites);
      expect(store).to.have.deep.property('stats', testData.stats);
      expect(store).to.have.property('enableChart', false);
      expect(store).to.have.property('devMode', false);
      expect(store).to.have.property('showHooks', 'failed');
    });

    it('with config options', () => {
      store.setInitialData({
        data: testData,
        config: {
          enableCharts: true,
          dev: true,
          showHooks: 'context'
        }
      });
      expect(store).to.have.property('data', testData);
      expect(store).to.have.property('reportTitle', undefined);
      expect(store).to.have.property('stats', testData.stats);
      expect(store).to.have.deep.property('allSuites[0]', testData.suites);
      expect(store).to.have.deep.property('stats', testData.stats);
      expect(store).to.have.property('enableChart', true);
      expect(store).to.have.property('devMode', true);
      expect(store).to.have.property('showHooks', 'context');
    });


    it('with invalid config options', () => {
      store.setInitialData({
        data: testData,
        config: {
          showHooks: 'sometimes'
        }
      });
      expect(store).to.have.property('showHooks', 'failed');
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      store.setInitialData({ data: testData, config: {} });
    });

    describe('suites', () => {
      it('is not empty when filters are on', () => {
        store.toggleFilter('showSkipped');
        expect(store.suites).to.have.lengthOf(1);
        store.toggleFilter('showSkipped');
      });

      it('is empty when fiilters are off', () => {
        store.toggleFilter('showPassed');
        store.toggleFilter('showFailed');
        store.toggleFilter('showPending');
        store.setShowHooks('never');
        expect(store.suites).to.have.lengthOf(0);
      });
    });
  });

  describe('Filters', () => {
    it('without filters', () => {
      store.setInitialData({
        data: testData,
        config: {}
      });

      expect(store).to.have.property('showPassed', true);
      expect(store).to.have.property('showFailed', true);
      expect(store).to.have.property('showPending', true);
      expect(store).to.have.property('showSkipped', false);
    });

    it('with invalid filter', () => {
      store.setInitialData({
        data: testData,
        config: {
          filter: 'abcdef'
        }
      });

      expect(store).to.have.property('showPassed', true);
      expect(store).to.have.property('showFailed', true);
      expect(store).to.have.property('showPending', true);
      expect(store).to.have.property('showSkipped', false);
    });

    it('only passed', () => {
      store.setInitialData({
        data: testData,
        config: {
          filter: 'passed'
        }
      });

      expect(store).to.have.property('showPassed', true);
      expect(store).to.have.property('showFailed', false);
      expect(store).to.have.property('showPending', false);
      expect(store).to.have.property('showSkipped', false);
    });

    it('only failed', () => {
      store.setInitialData({
        data: testData,
        config: {
          filter: 'failed'
        }
      });

      expect(store).to.have.property('showPassed', false);
      expect(store).to.have.property('showFailed', true);
      expect(store).to.have.property('showPending', false);
      expect(store).to.have.property('showSkipped', false);
    });

    it('only pending', () => {
      store.setInitialData({
        data: testData,
        config: {
          filter: 'pending'
        }
      });

      expect(store).to.have.property('showPassed', false);
      expect(store).to.have.property('showFailed', false);
      expect(store).to.have.property('showPending', true);
      expect(store).to.have.property('showSkipped', false);
    });

    it('only skipped', () => {
      store.setInitialData({
        data: testData,
        config: {
          filter: 'skipped'
        }
      });

      expect(store).to.have.property('showPassed', false);
      expect(store).to.have.property('showFailed', false);
      expect(store).to.have.property('showPending', false);
      expect(store).to.have.property('showSkipped', true);
    });

    it('show passed, failed, pending and skipped', () => {
      store.setInitialData({
        data: testData,
        config: {
          filter: 'passed+failed+pending+skipped'
        }
      });

      expect(store).to.have.property('showPassed', true);
      expect(store).to.have.property('showFailed', true);
      expect(store).to.have.property('showPending', true);
      expect(store).to.have.property('showSkipped', true);
    });
  });

  describe('Actions', () => {
    beforeEach(() => {
      store.setInitialData({ data: testData, config: {} });
    });

    it('openSideNav', () => {
      expect(store).to.have.property('sideNavOpen', false);
      store.openSideNav();
      expect(store).to.have.property('sideNavOpen', true);
    });

    it('closeSideNav', () => {
      store.openSideNav();
      expect(store).to.have.property('sideNavOpen', true);
      store.closeSideNav();
      expect(store).to.have.property('sideNavOpen', false);
    });

    it('toggleFilter, showPassed', () => {
      expect(store).to.have.property('showPassed', true);
      store.toggleFilter('showPassed');
      expect(store).to.have.property('showPassed', false);
    });

    it('toggleFilter, showFailed', () => {
      expect(store).to.have.property('showFailed', true);
      store.toggleFilter('showFailed');
      expect(store).to.have.property('showFailed', false);
    });

    it('toggleFilter, showPending', () => {
      expect(store).to.have.property('showPending', true);
      store.toggleFilter('showPending');
      expect(store).to.have.property('showPending', false);
    });

    it('toggleFilter, showSkipped', () => {
      expect(store).to.have.property('showSkipped', false);
      store.toggleFilter('showSkipped');
      expect(store).to.have.property('showSkipped', true);
    });

    it('setShowHooks', () => {
      expect(store).to.have.property('showHooks', 'failed');
      store.setShowHooks('always');
      expect(store).to.have.property('showHooks', 'always');
    });

    it('setShowHooks (invalid prop)', () => {
      expect(store).to.have.property('showHooks', 'failed');
      store.setShowHooks('sometimes');
      expect(store).to.have.property('showHooks', 'failed');
    });
  });
});
