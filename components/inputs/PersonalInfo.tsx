import { useAuth } from '@/context/AuthContext'
import { Grid, GridItem } from '../ui/grid'
import DisplayInput from './DisplayInput'


const PersonalInfo = () => {
    const {user} = useAuth()
    return (
        <Grid 
        _extra={{
            className: "lg:grid-cols-12 lg:grid-cols-12 grid-cols-1 gap-4"
        }}>
        <GridItem
            _extra={{
            className: "lg:col-span-4"
            }}>
            <DisplayInput label='Name' value={user?.displayName} fallback='Ex. John Doe'/>
        </GridItem>
        <GridItem
            _extra={{
            className: "lg:col-span-4"
            }}>
            <DisplayInput label='Email' value={user?.email} fallback='Ex. example@email.com'/>
        </GridItem>
        <GridItem
            _extra={{
            className: "lg:col-span-4 lg:row-span-2"
            }}>
            <DisplayInput label='Phone Number' value={user?.phoneNumber} fallback='N/A'/>
        </GridItem>
        </Grid>
    )
}

export default PersonalInfo