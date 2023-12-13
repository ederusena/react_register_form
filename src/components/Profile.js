import { Link } from "react-router-dom"

const Profile = () => {
    return (
        <section>
            <h1>The Profile</h1>
            <br />
            <p>User can user this route.</p>
            <div className="flexGrow">
                <Link to="/">Home</Link>
            </div>
        </section>
    )
}

export default Profile
