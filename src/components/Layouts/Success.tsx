import styles from '../../styles/Success.module.scss'

const Success = (props: any) => {
  return (
    <>
        <span className={styles.successContainer}>
            {props.successMessage}
        </span>
    </>
  )
}

export default Success