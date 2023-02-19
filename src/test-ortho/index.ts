import { Box3, Color, DoubleSide, Float32BufferAttribute, Mesh, MeshBasicMaterial, OrthographicCamera, Scene, Shape, ShapeGeometry, Vector2, Vector3, WebGLRenderer } from "three";

const rendererBig = new WebGLRenderer();
const divBig = document.getElementById('big-render-elem') as HTMLDivElement;
rendererBig.setSize( divBig.clientWidth, divBig.clientHeight );
divBig.appendChild(rendererBig.domElement);


const scene = new Scene();
scene.background = new Color( 0xffffff );

const cam = new OrthographicCamera();

const poly = createPoly();
scene.add(poly);

fitCamOverObject(cam, poly);

rendererBig.render(scene, cam);




function createPoly() {
    
    const points: readonly Vector3[] = [
        new Vector3(0, 0, 0),
        new Vector3(4, 0, 0),
        new Vector3(3, 0, 1.5),
        new Vector3(4, 0, 3),
        // new Vector3(2, 0, 4),
        new Vector3(0, 0, 3)
    ];

    console.log("new poly", points.map(pos => `${pos.x.toFixed(2)}/${pos.y.toFixed(2)}/${pos.z.toFixed(2)}`));
    
    let polyShape = new Shape(
        points
            .map((v3) => {
                const v2 = new Vector2(v3.x, v3.z);
                return v2;
            })
    );

    const polyGeometry = new ShapeGeometry(polyShape);
    polyGeometry.setAttribute(
        "position",
        new Float32BufferAttribute(
            points.map(v3 => [v3.x, v3.y, v3.z]).flat(),
            3
        )
    )

    const polyMesh = new Mesh(
        polyGeometry,
        new MeshBasicMaterial({ color: 0x999999, side: DoubleSide })
    )
    
    return polyMesh;
}


function fitCamOverObject(
    camera: OrthographicCamera,
    object: any,
    sizeFactor: number = 0.5
): number {

    // const marginFactor = 0.5;
    const boundingBox = new Box3();
    boundingBox.setFromObject(object);

    const center = boundingBox.getCenter(new Vector3());
    const size = boundingBox.getSize(new Vector3());

    const gfpLengthInMeters = size.x;
    const gfpWidthInMeters = size.z;

    let xPxPerMeter =  window.innerWidth / gfpLengthInMeters;
    let yPxPerMeter =  window.innerHeight / gfpWidthInMeters;

    let pxPerMeter = Math.min(xPxPerMeter, yPxPerMeter) * sizeFactor;

    const lengthToShow = window.innerWidth / pxPerMeter;
    const widthToShow = window.innerHeight / pxPerMeter;

    camera.left = -lengthToShow / 2;
    camera.right = lengthToShow / 2;
    camera.top = -widthToShow / 2;
    camera.bottom = widthToShow / 2;
    
    camera.position.set(
        center.x,
        1,
        center.z
    );
    camera.lookAt(center.x, center.y, center.z);
    camera.updateProjectionMatrix();

    return pxPerMeter;
};