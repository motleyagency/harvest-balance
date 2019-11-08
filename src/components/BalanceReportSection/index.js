import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useStopwatch } from 'react-timer-hook';
import Section from '../Section';
import storage, { storageDateKey } from '../../util/storage';
import BalanceReportForm from '../BalanceReportForm';
import BalanceReport from '../BalanceReport';
import { balanceReport } from '../../util/harvestBalance';

const ShrinkingSection = styled(Section)`
  transition: padding 0.5s ease-out;
`;

function BalanceReportSection({ color, size }) {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const {
    seconds: secondsLoaded,
    start: startTimer,
    reset: resetTimer,
  } = useStopwatch({
    autoStart: false,
  });
  const [report, setReport] = useState();
  const [startDate, setStartDate] = useState(() =>
    storage.get(
      storageDateKey,
      moment()
        .startOf('year')
        .format('YYYY-MM-DD'),
    ),
  );
  const [includeToday, setIncludeToday] = useState(false);
  const maxDate = moment().format('YYYY-MM-DD');

  const handleSetStartDate = date => {
    setStartDate(date);
    storage.set(storageDateKey, date);
  };

  const toggleIncludeToday = () => {
    setIncludeToday(!includeToday);
  };

  const getReport = () => {
    const date = moment(startDate);
    if (!date.isValid()) {
      setError('Invalid date');
    } else {
      setLoading(true);
      startTimer();
      setReport(null);
      balanceReport({
        startDate: date.startOf('day').format('YYYYMMDD'),
        includeToday,
      })
        .then(report => {
          setReport(report);
          resetTimer();
          setLoading(false);
        })
        .catch(e => {
          setError(e.error_description || e.error || e);
          resetTimer();
          setLoading(false);
        });
    }
  };

  return (
    <ShrinkingSection
      size={loading || error || report ? '' : 'large'}
      color={color}
    >
      <div className="container">
        <div className="level">
          <div className="level-item">
            <BalanceReportForm
              loading={loading}
              onSubmit={getReport}
              startDate={startDate}
              setStartDate={handleSetStartDate}
              maxDate={maxDate}
              includeToday={includeToday}
              toggleIncludeToday={toggleIncludeToday}
            />
          </div>
        </div>
        <div className="level">
          <div className="level-item">
            <BalanceReport
              loading={loading}
              loadingPhase={Math.floor(secondsLoaded / 4)}
              error={error}
              report={report}
            />
          </div>
        </div>
      </div>
    </ShrinkingSection>
  );
}

export default BalanceReportSection;
