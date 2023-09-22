import { PropagateLoader } from "react-spinners";

function Loading() {

    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

    return (
        <div style={style}>
            <PropagateLoader color="#36d7b7" />
        </div>
    );
}

export default Loading;