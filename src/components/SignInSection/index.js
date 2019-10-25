import React from 'react';
import Section from './../Section';
import SectionHeader from './../SectionHeader';
import SignIn from './../SignIn';
import './styles.scss';

function SignInSection({ color, size, title, subtitle }) {
  return (
    <Section color={color} size={size}>
      <div className="container">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          centered={true}
          size={3}
        />
        <SignIn />
      </div>
    </Section>
  );
}

export default SignInSection;
