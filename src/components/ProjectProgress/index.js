import React from 'react';
import styled from 'styled-components';

const round = num => Math.round(num * 100) / 100;
const dailyHours = 7.5;
const weeklyMax = dailyHours * 5;

const Name = styled.h3`
  font-weight: 600;
  margin: 0 0 0.25em;
  font-size: 1em;
`;

const Allocation = styled.p`
  font-size: 80%;
  padding: 0.25em 0.75em;
  text-align: right;
`;

const ProgressBar = styled.div(
  ({ min, max }) => `
  width: 100%;
  background: none;
  border: 1px solid rgb(200,200,200);
  position: relative;
  background: repeating-linear-gradient(
    -55deg,
    #333,
    #333 10px,
    #444 10px,
    #444 20px
  );

  &:before,
  &:after {
    padding: 1.5em .75em;
    display: block;
    line-height: 1;
  }

  &:before {
    content: '${Math.round((min / max) * 100)}% done';
    width: ${round((min <= max ? min : max) / weeklyMax) * 100}%;
    background: ${min ? (min <= max ? '#0aad5c' : '#02da76') : '#b2dcc7'};
    position: absolute;
    left: -1px; top: -1px; bottom: -1px;
    font-size: 80%;
    color: #FFF;
    font-weight: ${min > max ? '900' : '600'};
    box-shadow: 4px 0 3px -2px rgba(0, 0, 0, .2);
    white-space: nowrap;
  }

  &:after {
    content: '';
    width: ${(max / weeklyMax) * 100}%;
    background: #ffc231;
  }
`,
);

function ProjectProgress({ name, scope, progress }) {
  if (!name || !scope) return null;

  return (
    <>
      <Name>{name}</Name>
      <ProgressBar min={progress} max={scope} />
      <Allocation>
        of {Math.round((scope / dailyHours) * 10) / 10} days allocated
      </Allocation>
    </>
  );
}

export default ProjectProgress;
