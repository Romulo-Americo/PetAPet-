import styles from './Containe.module.css'

function Container({children}){
    return <main className={styles.container}>
        {children}
    </main>
}

export default Container