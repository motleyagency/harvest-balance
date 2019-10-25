import React from 'react';
import styled from 'styled-components';

const Name = styled.h3``;
const ProgressBar = styled.div`
  width: 100%;
  background: none;
  border: 1px solid rgba(0,0,0, .1);
  position: relative;
  overflow: hidden;

  &:before,
  &:after {
    font-size: 80%;
    padding: .5em;
    display: block;
  }

  &:before {
    content: '${({ min, max }) => (min / max) * 100}% done';
    width: ${({ min, max }) => min / max} * 100%;
    background: green;
    position: absolute;
    left: 0; top: 0; bottom: 0;
  }

  &:after {
    content: '${({ max }) => max}% of allocated';
    width: ${({ max }) => max}%;
    background: orange;
    text-align: right;
  }
`;

function ProjectProgress({ name, scope, progress }) {
  if (!name || !scope) return null;

  return (
    <>
      <Name>{name}</Name>
      <ProgressBar min={progress} max={scope} />
    </>
  );
}

export default ProjectProgress;
