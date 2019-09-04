import React from 'react';
import { Transition } from 'react-transition-group';
import { bool, shape, number, string } from 'prop-types';
import styled from 'styled-components';
import BalanceReportDetails from '../BalanceReportDetails';

const Header = styled.div`
  font-size: 1.5rem;
  text-align: center;
  transform: translateY(0.5rem);
`;
const Progress = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;
const SubHeader = styled.p`
  position: absolute;
  top: 1rem;
  transition: opacity 300ms ease-in-out;
  opacity: 0;

  ${({ state }) => {
    switch (state) {
      case 'entering':
        return `opacity: 1;`;
      case 'entered':
        return `opacity: 1;`;
      case 'exiting':
        return `opacity: 0;`;
      case 'exited':
        return `opacity: 0;`;
      default:
        return '';
    }
  }}
`;
const Balance = styled.div`
  position: relative;
  text-align: center;
  margin-bottom: 3rem;
`;
const Hours = styled.span`
  font-size: 5rem;
`;
const H = styled.span`
  font-size: 2rem;
  position: absolute;
  top: 1.2rem;
`;
const Minutes = styled.span`
  font-size: 2rem;
`;
const M = styled.span`
  font-size: 1rem;
  margin-left: 0.2rem;
`;

const BalanceReport = ({ loading, loadingPhase, error, report }) => {
  if (loading) {
    return (
      <div className="has-text-centered">
        <Header>Calculating balance</Header>
        <Progress>
          <Transition in={loadingPhase === 1} timeout={300} appear>
            {state => (
              <SubHeader state={state}>
                This usually takes a while...{' '}
                <span role="img" aria-label="blowing a kiss">
                  😘
                </span>
              </SubHeader>
            )}
          </Transition>
          <Transition in={loadingPhase === 2} timeout={300} appear>
            {state => (
              <SubHeader state={state}>
                Still calculating...{' '}
                <span role="img" aria-label="cold sweat">
                  😰
                </span>
              </SubHeader>
            )}
          </Transition>
          <Transition in={loadingPhase === 3} timeout={300} appear>
            {state => (
              <SubHeader state={state}>
                Any second now...{' '}
                <span role="img" aria-label="grimacing face">
                  😬
                </span>
              </SubHeader>
            )}
          </Transition>
          <Transition in={loadingPhase >= 4} timeout={300} appear>
            {state => (
              <SubHeader state={state}>
                Ok, this is taking longer than expected...{' '}
                <span role="img" aria-label="blushing">
                  😳
                </span>
              </SubHeader>
            )}
          </Transition>
        </Progress>
      </div>
    );
  }

  if (error) {
    return (
      <div className="has-text-centered">
        <Header>
          Ooops, couldn't get your balance{' '}
          <span role="img" aria-label="disappointed face">
            😞
          </span>
        </Header>
        <SubHeader>{error}</SubHeader>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  const {
    balance: { hours, minutes },
    dayTotals,
  } = report;

  return (
    <div>
      <Header>Your balance is</Header>
      <Balance>
        <Hours>{hours}</Hours>
        <H>h</H>
        <Minutes>{Math.abs(minutes)}</Minutes>
        <M>min</M>
      </Balance>
      <BalanceReportDetails dayTotals={dayTotals} />
    </div>
  );
};

BalanceReport.defaultProps = {
  loading: false,
  loadingPhase: 0,
  report: null,
  error: null,
};

BalanceReport.propTypes = {
  loading: bool,
  loadingPhase: number,
  error: string,
  report: shape({
    balance: shape({
      hours: number,
      minutes: number,
    }),
    dayTotals: shape({}),
  }),
};

export default BalanceReport;
