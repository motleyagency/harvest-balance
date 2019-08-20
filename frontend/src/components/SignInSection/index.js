import React from 'react';
import styled from 'styled-components';
import Section from './../Section';
import SectionHeader from './../SectionHeader';
import SignIn from './../SignIn';
import './styles.scss';

const BigSection = styled(Section)`
  && {
    padding-top: calc(45vh - 85px);
  }
`;

function SignInSection({ color, size, title, subtitle }) {
  return (
    <BigSection color={color} size={size}>
      <div className="container">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          centered={true}
          size={3}
        />
        <SignIn />
      </div>
    </BigSection>
  );
}

export default SignInSection;
