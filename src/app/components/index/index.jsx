import Link from "next/link";
import Image from "next/image";
import "./index.css";

function Index() {
  return (
    <div className="container">
      {/* Primera columna */}
      <div className="textColumn">
        <h1 className="title">App de Gastos</h1>
        <p className="description">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nisi, sint ipsa? Exercitationem
          beatae quaerat ducimus totam, nobis sapiente fugiat facere hic qui est quo velit distinctio
          consequuntur recusandae ab maiores?
        </p>
        <Link href="/auth/login">
          <button className="startButton">Start!</button>
        </Link>
      </div>

      {/* Segunda columna */}
      <div className="imageColumn">
        <Image className="image" src="/laptop.jpg" alt="Laptop" width={400} height={400} />
      </div>
    </div>
  );
}

export default Index;
