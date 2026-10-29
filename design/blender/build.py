"""Italian Rides — procedural Vespa + studio still (v3: lamp, mirrors, seat).

Track: object-modeling (vehicle). One idempotent script: true-scale
blockout, side-elevation studio still on white for the frieze art slots.

Usage (from project root):
  Blender -b --factory-startup --python-exit-code 1 -P design/blender/build.py
  ... -- --final        # full quality + save .blend
"""

import os
import sys

sys.path.insert(
    0,
    os.path.expanduser(
        "~/.local/share/muse/skills/bundled/muse-core--exact-minimal-literal-tests/skills/blender/scripts"
    ),
)
import bpy_helpers as H  # noqa: E402

FINAL = "--final" in sys.argv

P = {
    "wheel_r": 0.20,
    "wheel_w": 0.10,
    "wheelbase": 1.20,
    "preview": "/tmp/italian-rides-vespa-preview.png",
    "final": "design/renders/vespa-side-v1.png",
    "blend": "design/blender/vespa-blockout.blend",
}

# Legshield side profile as (length, height); front is -length.
# Extruded 0.40 wide, rotation (90,90,0) maps (x,y,z) -> (z,x,y).
SHIELD_PROFILE = [
    (-0.74, 0.30),
    (-0.735, 0.45),
    (-0.71, 0.60),
    (-0.675, 0.74),
    (-0.625, 0.87),
    (-0.565, 0.98),
    (-0.52, 1.02),
    (-0.50, 0.88),
    (-0.485, 0.74),
    (-0.475, 0.60),
    (-0.46, 0.46),
    (-0.44, 0.34),
    (-0.55, 0.28),
]


def build():
    H.reset_scene()
    rosso = H.material_preset("rosso", "car_paint", "#c1271b")
    rubber = H.material_preset("rubber", "rubber")
    steel = H.material_preset("steel", "steel")
    chrome = H.material_preset("chrome", "chrome")
    leather = H.material_preset("seat", "leather", "#2a2320")
    darkmetal = H.material("darkmetal", "#3a3a3c", roughness=0.5, metallic=0.8)
    lampglass = H.material(
        "lampglass",
        "#fff6e0",
        roughness=0.1,
        metallic=0.0,
        emission="#ffedb8",
        emission_strength=0.6,
    )
    tailred = H.material(
        "tailred", "#7a0d08", emission="#ff2a1a", emission_strength=0.8
    )

    r, wb = P["wheel_r"], P["wheelbase"]
    yF, yR = -wb / 2, wb / 2
    objs = []
    objs.append(
        H.add_wheel(
            "wheel_F", radius=r, width=P["wheel_w"], location=(0, yF, r),
            spokes=5,
        )
    )
    objs.append(
        H.add_wheel(
            "wheel_R", radius=r, width=P["wheel_w"], location=(0, yR, r),
            spokes=5,
        )
    )
    objs.append(
        H.add_box(
            "floorboard", size=(0.36, 0.55, 0.05), location=(0, -0.05, 0.30),
            bevel=0.01, mat=rosso,
        )
    )
    objs.append(
        H.add_extrusion(
            "legshield", SHIELD_PROFILE, depth=0.40, bevel=0.015,
            location=(-0.20, 0, 0), rotation=(90, 90, 0), mat=rosso,
        )
    )
    objs.append(
        H.add_cylinder(
            "column", radius=0.035, depth=0.80, location=(0, -0.55, 0.68),
            rotation=(-12, 0, 0), mat=rosso,
        )
    )
    objs.append(
        H.add_box(
            "headset", size=(0.15, 0.13, 0.16), location=(0, -0.50, 1.04),
            bevel=0.03, mat=rosso,
        )
    )
    objs.append(
        H.add_tube(
            "handlebar",
            [(-0.26, -0.52, 1.10), (0, -0.50, 1.12), (0.26, -0.52, 1.10)],
            radius=0.016, mat=steel,
        )
    )
    for side, name in ((-1, "grip_L"), (1, "grip_R")):
        objs.append(
            H.add_cylinder(
                name, radius=0.022, depth=0.12,
                location=(side * 0.28, -0.52, 1.10), rotation=(0, 90, 0),
                mat=rubber,
            )
        )
    for side, name in ((-1, "mirror_L"), (1, "mirror_R")):
        objs.append(
            H.add_tube(
                name + "_stalk",
                [(side * 0.24, -0.52, 1.10), (side * 0.30, -0.54, 1.26)],
                radius=0.008, mat=steel,
            )
        )
        objs.append(
            H.add_cylinder(
                name, radius=0.04, depth=0.012,
                location=(side * 0.30, -0.54, 1.28), rotation=(90, 20, 0),
                mat=chrome,
            )
        )
    objs.append(
        H.add_sphere(
            "headlamp", radius=0.07, scale=(1, 0.7, 1),
            location=(0, -0.63, 0.88), mat=lampglass,
        )
    )
    objs.append(
        H.add_box(
            "cowl", size=(0.42, 0.66, 0.44), location=(0, 0.48, 0.47),
            bevel=0.10, mat=rosso,
        )
    )
    objs.append(
        H.add_box(
            "seat", size=(0.30, 0.46, 0.12), location=(0, 0.45, 0.72),
            bevel=0.05, mat=leather,
        )
    )
    objs.append(
        H.add_cylinder(
            "muffler", radius=0.05, depth=0.34, location=(0.10, 0.30, 0.23),
            rotation=(90, 0, 0), mat=darkmetal,
        )
    )
    objs.append(
        H.add_box(
            "taillight", size=(0.08, 0.03, 0.06), location=(0, 0.82, 0.55),
            mat=tailred,
        )
    )
    return [o for o in objs if o is not None]


def main():
    objs = build()
    H.studio_lighting(target=objs, key_azimuth=30, intensity=1.0)
    cam = H.add_camera(
        "cam_side", location=(3.2, 0.0, 0.8), target=(0, 0, 0.55), lens=85
    )
    H.frame_objects(cam, objs, azimuth=90, elevation=8, margin=1.15)
    out = P["final"] if FINAL else P["preview"]
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    H.set_render(
        resolution=(1200, 900),
        samples=64 if FINAL else 16,
        percentage=100 if FINAL else 50,
        view_transform="Khronos PBR Neutral",
    )
    H.render_still(out, background="#FFFFFF")
    if FINAL:
        os.makedirs(os.path.dirname(P["blend"]), exist_ok=True)
        H.save_blend(P["blend"])
    H.report()
    print("WROTE", out)


main()
