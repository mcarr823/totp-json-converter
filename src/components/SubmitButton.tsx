import styles from '../css/Button.module.css';

export default function SubmitButton({
    text, click
} : {
    text: string,
    click: () => void
}){

    return (
        <button
            className={styles.btnBlue}
            onClick={click}
        >{text}</button>
    );

}