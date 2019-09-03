import React, { useState } from 'react';
import SectionButton from '../SectionButton';
import styled from 'styled-components';
import harvestIcon from '../../assets/harvest-h.svg';
import { useAuth } from '../../util/auth';

const HarvestLogo = styled.img`
  margin-right: 1rem;
  vertical-align: top;
`;

const Error = styled.p`
  margin-top: 3rem;
`;

const SignIn = () => {
  const [error, setError] = useState();
  const { signin, isAuthenticating } = useAuth();

  const handleSignIn = () => {
    signin().catch(err => {
      setError(err);
    });
  };

  return (
    <div className="has-text-centered">
      {!isAuthenticating ? (
        <SectionButton size="medium" onClick={handleSignIn}>
          <HarvestLogo src={harvestIcon} alt="SignIn with Harvest" />
          Sign in with Harvest
        </SectionButton>
      ) : (
        <p>Signing in, hold on a sec...</p>
      )}
      {error && <Error>{error}</Error>}
    </div>
  );
};

export default SignIn;
