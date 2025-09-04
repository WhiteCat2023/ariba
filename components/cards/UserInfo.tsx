import { Card } from "../ui/card";
import { Divider } from "../ui/divider";
import EditUserInfo from "./components/EditUserInfo";
import ProfileDeletionCard from "./components/ProfileDeletionCard";
import ProfileHeader from "./components/ProfileHeader";

interface UserInfoProp {
    user: {
        photoURL: string,
        displayName: string,
        email: string,
        phoneNumber: string
    };
}

const UserInfo: React.FC<UserInfoProp> = ({user}) => {
  return (
    <Card>
        <ProfileHeader user={user}/>
        <Divider className="my-4 "/>
        <EditUserInfo user={user}/>
        <Divider className="my-4 "/>
        <ProfileDeletionCard/>
    </Card>
  )
}

export default UserInfo