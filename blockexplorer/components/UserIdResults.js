import UserIdResult from './UserIdResult';

function UserIdResults({ userIdResults }) {
  return (
    <div>
      {userIdResults.map((userResult) => (
        <UserIdResult
          key={userResult.transactionId}
          amount={userResult.amount}
          sender={userResult.sender}
          recipient={userResult.recipient}
          transactionId={userResult.transactionId}
        />
      ))}
    </div>
  );
}

export default UserIdResults;
