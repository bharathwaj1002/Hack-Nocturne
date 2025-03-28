import Captcha from "../components/Captcha";
import InputFields from "../components/InputFields";

function Main() {
    return (
        <>
            <h1>Captcha Example</h1>
            <div>
                <InputFields />
                <Captcha />
                {/* <TickBox />
      <CrossBox /> */}
                <a href="https://example.com"></a>
                <a href="https://example1.com"></a>
            </div>
        </>
    );
}

export default Main;
