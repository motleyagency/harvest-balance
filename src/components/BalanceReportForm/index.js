import React from 'react';
import { string, func } from 'prop-types';
import SectionButton from '../SectionButton';
import FormField from '../FormField';
import './styles.scss';

function BalanceReportForm({
  loading,
  startDate,
  setStartDate,
  maxDate,
  includeToday,
  toggleIncludeToday,
  onSubmit,
}) {
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Start calculating balance from</label>
        </div>
        <div className="field-body">
          <FormField
            narrow={true}
            type="date"
            name="startDate"
            max={maxDate}
            value={startDate}
            onChange={setStartDate}
          />
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label">
          <label className="label" htmlFor="includeToday">
            Include today
          </label>
        </div>
        <div className="field-body">
          <div className="field is-narrow">
            <label className="checkbox">
              <input
                id="includeToday"
                type="checkbox"
                name="includeToday"
                checked={includeToday}
                onChange={toggleIncludeToday}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="has-text-centered">
        <SectionButton
          onClick={handleSubmit}
          state={loading && 'loading'}
          disabled={loading}
        >
          Get balance
        </SectionButton>
      </div>
    </form>
  );
}

BalanceReportForm.propTypes = {
  startDate: string.isRequired,
  setStartDate: func.isRequired,
  onSubmit: func.isRequired,
};

export default BalanceReportForm;
