import Button from 'src/components/new/atoms/Button';
import JoinPageLayout from 'src/layouts/JoinPageLayout';
import { NextPage } from 'next';
import { Roles } from 'server/SocketTypes';
import buttonStyles from 'src/styles/new/components/atoms/button.module.scss';

interface RoleSelectorProps {
    setRole: (role: Roles) => void
}

const RoleSelector: NextPage<RoleSelectorProps> = ({ setRole }) => {
  return (
    <JoinPageLayout>
      <p>No player has connected and selected their role yet! Select a role for the next round. Make your choice:</p>
      <div className={buttonStyles['button-row']}>
        <Button
          onClick={() => {
            setRole(Roles.GUESSER);
          }}
        >
          Guess the Code!
        </Button>
        <Button
          onClick={() => {
            setRole(Roles.SETTER);
          }}
          containerClass={buttonStyles['second-button']}
        >
          Choose the Code!
        </Button>
      </div>
    </JoinPageLayout>
  );
};

export default RoleSelector;
