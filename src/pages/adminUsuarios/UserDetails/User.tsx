import { FunctionComponent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../../components/Layout";
import "../../solicitudes/CreditDetails/details.css"

interface UserDetailsProps {

}

const UserDetails: FunctionComponent<UserDetailsProps> = () => {
    //get User id from url
    const { id } = useParams();

    const navigate = useNavigate();

    const handleGoback = () => {
        navigate(-1);
    }

    return (
        <Layout>
            <div className="details-container">
                <div className="details-header">
                    <button onClick={handleGoback}>Go back</button>
                </div>
                <div>
                    {id}
                </div>
            </div>
        </Layout>
    );
}

export default UserDetails;