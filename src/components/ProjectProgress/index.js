import React from 'react';
import styled from 'styled-components';

const round = num => Math.round(num * 100) / 100;
const dailyHours = 7.5;
const weeklyMax = dailyHours * 5;

const Name = styled.h3``;
const Allocation = styled.p`
  font-size: 80%;
  padding: 0.25em 0.75em;
  text-align: right;
`;

const ProgressBar = styled.div`
  width: 100%;
  background: none;
  border: 1px solid rgba(0,0,0, .1);
  position: relative;

  &:before,
  &:after {
    padding: 1.5em .75em;
    display: block;
    line-height: 1;
  }

  &:before {
    content: '${({ min, max }) => Math.round((min / max) * 100)}% done';
    width: ${({ min }) => round(min / weeklyMax) * 100}%;
    background: ${({ min }) => (min ? '#0aad5c' : '#b2dcc7')};
    position: absolute;
    left: -1px; top: -1px; bottom: -1px;
    font-size: 80%;
    color: #FFF;
    font-weight: 600;
    box-shadow: 4px 0 3px -2px rgba(0, 0, 0, .2);
    white-space: nowrap;
  }

  &:after {
    content: '';
    width: ${({ max }) => (max / weeklyMax) * 100}%;
    background: #ffc231;
  }
`;

function ProjectProgress({ name, scope, progress }) {
  if (!name || !scope) return null;

  return (
    <>
      <Name>{name}</Name>
      <ProgressBar min={progress} max={scope} />
      <Allocation>of {scope / dailyHours} days allocated</Allocation>
    </>
  );
}

export default ProjectProgress;
