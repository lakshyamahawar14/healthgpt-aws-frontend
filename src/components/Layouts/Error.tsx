import styles from '../../styles/Error.module.scss'

const Error = (props: any) => {
  return (
    <>
        <span className={styles.errorContainer}>
            {props.errorMessage}
        </span>
    </>
  )
}

export default Error