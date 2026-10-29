"""Italian Rides — parametric Vespa series + studio stills (frieze art).

One idempotent script. Builds the stylized Vespa blockout once per model with
period livery + proportions, renders a side-elevation studio still on white.

Usage (from project root, needs unsandboxed shell for Blender GPU probe):
  Blender -b --factory-startup --python-exit-code 1 -P design/blender/series.py
  ... -- --models px150,gs150      # subset (default: all 12)
  ... -- --outdir public/frieze    # default
"""

import os
import sys

sys.path.insert(
    0,
    os.path.expanduser(
        "~/.local/share/muse/skills/bundled/muse-core--exact-minimal-literal-tests/skills/blender/scripts"
    ),
)
import bpy  # noqa: E402
import bpy_helpers as H  # noqa: E402

# key -> body color, seat color, wheel radius (m), overall scale
MODELS = {
    "v98": {"c": "#a89a72", "seat": "#2a2320", "wr": 0.16, "s": 0.94},
    "v125": {"c": "#b0a184", "seat": "#2a2320", "wr": 0.16, "s": 0.95},
    "gs150": {"c": "#1f1f22", "seat": "#111111", "wr": 0.18, "s": 0.98},
    "v50": {"c": "#7fa8c9", "seat": "#2a2320", "wr": 0.17, "s": 0.90},
    "ss180": {"c": "#e8e4da", "seat": "#2a2320", "wr": 0.18, "s": 0.98},
    "primavera": {"c": "#e8621a", "seat": "#2a2320", "wr": 0.17, "s": 0.92},
    "rally200": {"c": "#dedbd2", "seat": "#2a2320", "wr": 0.19, "s": 1.00},
    "px150": {"c": "#c1271b", "seat": "#2a2320", "wr": 0.20, "s": 1.00},
    "et4": {"c": "#b9bec4", "seat": "#2a2320", "wr": 0.19, "s": 1.00},
    "gts": {"c": "#33383d", "seat": "#1c1c1e", "wr": 0.20, "s": 1.06},
    "r946": {"c": "#c8ccd0", "seat": "#5b3a29", "wr": 0.19, "s": 1.00},
    "elettrica": {"c": "#aeb8b5", "seat": "#2a2320", "wr": 0.19, "s": 1.00},
}

SHIELD_PROFILE = [
    (-0.74, 0.30), (-0.735, 0.45), (-0.71, 0.60), (-0.675, 0.74),
    (-0.625, 0.87), (-0.565, 0.98), (-0.52, 1.02), (-0.50, 0.88),
    (-0.485, 0.74), (-0.475, 0.60), (-0.46, 0.46), (-0.44, 0.34),
    (-0.55, 0.28),
]

WHEELBASE = 1.20


def build(cfg):
    H.reset_scene()
    body = H.material_preset("body", "car_paint", cfg["c"])
    rubber = H.material_preset("rubber", "rubber")
    steel = H.material_preset("steel", "steel")
    chrome = H.material_preset("chrome", "chrome")
    leather = H.material_preset("seat", "leather", cfg["seat"])
    darkmetal = H.material("darkmetal", "#3a3a3c", roughness=0.5, metallic=0.8)
    lampglass = H.material(
        "lampglass", "#fff6e0", roughness=0.1, metallic=0.0,
        emission="#ffedb8", emission_strength=0.6,
    )
    tailred = H.material(
        "tailred", "#7a0d08", emission="#ff2a1a", emission_strength=0.8
    )

    r, wb = cfg["wr"], WHEELBASE
    yF, yR = -wb / 2, wb / 2
    o = []
    o.append(H.add_wheel("wheel_F", radius=r, width=0.10, location=(0, yF, r), spokes=5))
    o.append(H.add_wheel("wheel_R", radius=r, width=0.10, location=(0, yR, r), spokes=5))
    o.append(H.add_box("floorboard", size=(0.36, 0.55, 0.05), location=(0, -0.05, 0.30), bevel=0.01, mat=body))
    o.append(H.add_extrusion("legshield", SHIELD_PROFILE, depth=0.40, bevel=0.015, location=(-0.20, 0, 0), rotation=(90, 90, 0), mat=body))
    o.append(H.add_cylinder("column", radius=0.035, depth=0.80, location=(0, -0.55, 0.68), rotation=(-12, 0, 0), mat=body))
    o.append(H.add_box("headset", size=(0.15, 0.13, 0.16), location=(0, -0.50, 1.04), bevel=0.03, mat=body))
    o.append(H.add_tube("handlebar", [(-0.26, -0.52, 1.10), (0, -0.50, 1.12), (0.26, -0.52, 1.10)], radius=0.016, mat=steel))
    for side, name in ((-1, "grip_L"), (1, "grip_R")):
        o.append(H.add_cylinder(name, radius=0.022, depth=0.12, location=(side * 0.28, -0.52, 1.10), rotation=(0, 90, 0), mat=rubber))
    for side, name in ((-1, "mirror_L"), (1, "mirror_R")):
        o.append(H.add_tube(name + "_stalk", [(side * 0.24, -0.52, 1.10), (side * 0.30, -0.54, 1.26)], radius=0.008, mat=steel))
        o.append(H.add_cylinder(name, radius=0.04, depth=0.012, location=(side * 0.30, -0.54, 1.28), rotation=(90, 20, 0), mat=chrome))
    o.append(H.add_sphere("headlamp", radius=0.07, scale=(1, 0.7, 1), location=(0, -0.63, 0.88), mat=lampglass))
    o.append(H.add_box("cowl", size=(0.42, 0.66, 0.44), location=(0, 0.48, 0.47), bevel=0.10, mat=body))
    o.append(H.add_box("seat", size=(0.30, 0.46, 0.12), location=(0, 0.45, 0.72), bevel=0.05, mat=leather))
    o.append(H.add_cylinder("muffler", radius=0.05, depth=0.34, location=(0.10, 0.30, 0.23), rotation=(90, 0, 0), mat=darkmetal))
    o.append(H.add_box("taillight", size=(0.08, 0.03, 0.06), location=(0, 0.82, 0.55), mat=tailred))
    objs = [x for x in o if x is not None]
    # Uniform scale about the origin keeps z=0 ground contact exact.
    root = bpy.data.objects.new("ROOT", None)
    bpy.context.scene.collection.objects.link(root)
    for x in objs:
        x.parent = root
    root.scale = (cfg["s"], cfg["s"], cfg["s"])
    return objs


def render_key(key, outdir):
    cfg = MODELS[key]
    objs = build(cfg)
    H.studio_lighting(target=objs, key_azimuth=30, intensity=1.0)
    cam = H.add_camera("cam_side", location=(3.2, 0.0, 0.8), target=(0, 0, 0.55), lens=85)
    H.frame_objects(cam, objs, azimuth=90, elevation=8, margin=1.15)
    H.set_render(resolution=(600, 450), samples=14, percentage=100, view_transform="Khronos PBR Neutral")
    out = os.path.join(outdir, key + ".png")
    H.render_still(out, background="#FFFFFF")
    bdir = "design/blender/series"
    os.makedirs(bdir, exist_ok=True)
    H.save_blend(os.path.join(bdir, key + ".blend"))
    print("WROTE", out, flush=True)


def main():
    args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    keys = list(MODELS)
    outdir = "public/frieze"
    for a in args:
        if a.startswith("--models="):
            keys = [k.strip() for k in a.split("=", 1)[1].split(",") if k.strip() in MODELS]
        if a.startswith("--outdir="):
            outdir = a.split("=", 1)[1]
    os.makedirs(outdir, exist_ok=True)
    for key in keys:
        render_key(key, outdir)
    print("SERIES DONE", len(keys), "models", flush=True)


main()
