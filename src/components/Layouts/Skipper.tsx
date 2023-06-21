import styles from '../../styles/Skipper.module.scss'

const Skipper = (props: any) => {

    const handlePrevClick = () => {
        props.onPrev(6);
    }

    const handleNextClick = () => {
        props.onNext(6);
    }

  return (
    <>
        <div id='skipper' className={styles.container}>
            <div className={styles.skipperContainer}>
                <div id="prev" onClick={handlePrevClick}>&lt; Previous</div>
                <div id="page">Page: {props.page}</div>
                <div id="next" onClick={handleNextClick}>Next &gt;</div>
            <div></div>
            </div>
        </div>
    </>
  )
}

export default Skipper