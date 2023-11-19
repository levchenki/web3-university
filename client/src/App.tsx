import {FC} from "react";
import {Main} from "./layout/Main.tsx";
import {Footer} from "./layout/Footer.tsx";
import {Header} from "./layout/Header.tsx";

const App: FC = () =>
    <div className='flex flex-col h-screen'>
        <Header/>
        <Main/>
        <Footer/>
    </div>


export default App
