import RightAward from "./right-award";
import RightFans from "./right-fans";
import RightFriends from "./right-friends";
import RightKarma from "./right-karma";

const DashboardRight = () => {
  return (
    <>
      <style>
        {`
        //Right
#plurk-dashboard h2 {
    font-size: 14px;
    padding: 2px;
    display: block;
}
h2 {
    font-family: Arial, Verdana, sans-serif;
}
        `}
      </style>
      <div className="dash-group-right">
        <RightKarma />
        <RightFriends />
        <RightFans />
        <RightAward />
      </div>
    </>
  )
}

export default DashboardRight