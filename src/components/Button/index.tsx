import * as React from 'react';
import './styles.scss';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    color: 'primary' | 'secondary' | 'disabled';
    customClassName?: string;
}

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    const { color, customClassName, ...btnProps } = props;
    return (
        <button className={`btn btn--${color} ${customClassName || ''}`} {...btnProps}>
            {props.children}
        </button>
    );
};
