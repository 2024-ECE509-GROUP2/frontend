import { useRef } from "react";
import { Link } from "react-router-dom";

export default function BreadLink({children, href}) {
    const ref = useRef()

    return(
        <>
            <Link ref={ref} to={href}>
                {children}
            </Link>
        </>
    )
}