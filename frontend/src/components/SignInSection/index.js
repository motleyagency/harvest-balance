import React from 'react';
import Section from './../Section';
import SectionHeader from './../SectionHeader';
import SignIn from './../SignIn';
import './styles.scss';

function SignInSection(props) {
  return (
    <Section color={props.color} size={props.size}>
      <div className="container">
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          centered={true}
          size={3}
        />
        <SignIn />
      </div>
    </Section>
  );
}

export default SignInSection;
