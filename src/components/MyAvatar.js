// hooks
import useAuth from '../hooks/useAuth';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { account } = useAuth();

  const name = `${account?.lname} ${account?.fname}`;

  return (
    <Avatar
      src={account?.profilepic}
      alt={`${account?.lname} ${account?.fname}`}
      color={account?.profilepic ? 'default' : createAvatar(`${account?.lname} ${account?.fname}`).color}
      {...other}
    >
      {createAvatar(`${account?.lname} ${account?.fname}`).name}
    </Avatar>
  );
}
