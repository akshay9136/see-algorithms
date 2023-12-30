import InputNumbers from './numbers';
import { motion } from 'framer-motion';

export function SortNumbers(props) {
    return (
        <div className="sortNumbers">
            <InputNumbers {...props} />
            {props.children}
        </div>
    );
}

export function Numbox({ index, value, ...rest }) {
    return (
        <motion.div className="numbox" id={`box${index}`} {...rest}>
            {value}
        </motion.div>
    );
}

export function Node({ index, value, ...rest }) {
    return (
        <motion.div className="numbox node" id={`node${index}`} {...rest}>
            {value}
        </motion.div>
    );
}

export function Edge({ index, value, ...rest }) {
    return <motion.div className="edge" id={`edge${index}`} {...rest} />;
}
