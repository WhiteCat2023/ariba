import React from "react";
import { Card } from "../ui/card";
import { Divider } from "../ui/divider";
import EditUserInfo from "./components/EditUserInfo";
import ProfileDeletionCard from "./components/ProfileDeletionCard";
import ProfileHeader from "./components/ProfileHeader";


const UserInfo = ({user}) => {
  return (
    <Card>
        <ProfileHeader user={user}/>
        <Divider className="my-4 "/>
        <EditUserInfo user={user}/>
    </Card>
  )
}

export default UserInfo