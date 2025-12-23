function Card(prop){

    return <>
    
    <div
        style={{
            width: "260px",
            padding: "18px",
            borderRadius: "12px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
            background: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "Arial, sans-serif",
            margin: "14px"
        }}
    >
        <img
            src={prop.dp}
            alt=""
            style={{
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "14px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.12)"
            }}
        />

        <h2 style={{ fontSize: "18px", margin: "6px 0", color: "#1f2937" }}>
            Username : - {prop.username}
        </h2>

        <h3 style={{ fontSize: "15px", margin: "4px 0", color: "#374151" }}>
            Age :- {prop.age}
        </h3>

        <h3 style={{ fontSize: "15px", margin: "4px 0", color: "#374151" }}>
            Phone :- {prop.phone}
        </h3>
    </div>
    
    </>
}

export default Card;