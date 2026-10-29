"""Italian Rides — detailed PX 150 studio still (hero 1:1 study).

Extends the series blockout with fender arc, rails, speedo, levers, cables,
cowl vents + latch, PX badge, stand, rear rack. Side elevation on white.

Usage (from project root, needs unsandboxed shell):
  Blender -b --factory-startup --python-exit-code 1 -P design/blender/px150.py
"""

import math
import os
import shutil
import sys

sys.path.insert(
    0,
    os.path.expanduser(
        "~/.local/share/muse/skills/bundled/muse-core--exact-minimal-literal-tests/skills/blender/scripts"
    ),
)
import bpy_helpers as H  # noqa: E402

OUT_RENDER = "design/renders/px150-detail.png"
OUT_PUBLIC = "public/frieze/px150.png"
OUT_BLEND = "design/blender/px150.blend"

CFG = {"c": "#c1271b", "seat": "#2a2320", "wr": 0.20}
WHEELBASE = 1.20

SHIELD_PROFILE = [
    (-0.74, 0.30), (-0.735, 0.45), (-0.71, 0.60), (-0.675, 0.74),
    (-0.625, 0.87), (-0.565, 0.98), (-0.52, 1.02), (-0.50, 0.88),
    (-0.485, 0.74), (-0.475, 0.60), (-0.46, 0.46), (-0.44, 0.34),
    (-0.55, 0.28),
]


def fender_arc(cy, cz, r_out, r_in, a0=-55, a1=55, step=11):
    pts = []
    a = a0
    while a <= a1 + 1e-6:
        t = math.radians(a)
        pts.append((cy + r_out * math.sin(t), cz + r_out * math.cos(t)))
        a += step
    a = a1
    while a >= a0 - 1e-6:
        t = math.radians(a)
        pts.append((cy + r_in * math.sin(t), cz + r_in * math.cos(t)))
        a -= step
    return pts


def build():
    H.reset_scene()
    body = H.material_preset("body", "car_paint", CFG["c"])
    rubber = H.material_preset("rubber", "rubber")
    steel = H.material_preset("steel", "steel")
    chrome = H.material_preset("chrome", "chrome")
    leather = H.material_preset("seat", "leather", CFG["seat"])
    darkmetal = H.material("darkmetal", "#3a3a3c", roughness=0.5, metallic=0.8)
    lampglass = H.material(
        "lampglass", "#fff6e0", roughness=0.1, metallic=0.0,
        emission="#ffedb8", emission_strength=0.6,
    )
    tailred = H.material(
        "tailred", "#7a0d08", emission="#ff2a1a", emission_strength=0.8
    )

    r, wb = CFG["wr"], WHEELBASE
    yF, yR = -wb / 2, wb / 2
    o = []
    o.append(H.add_wheel("wheel_F", radius=r, width=0.10, location=(0, yF, r), spokes=5))
    o.append(H.add_wheel("wheel_R", radius=r, width=0.10, location=(0, yR, r), spokes=5))
    o.append(H.add_extrusion(
        "fender_F", fender_arc(yF, r, 0.25, 0.235), depth=0.16,
        bevel=0.006, location=(-0.08, 0, 0), rotation=(90, 90, 0), mat=body,
    ))
    o.append(H.add_box("floorboard", size=(0.36, 0.55, 0.05), location=(0, -0.05, 0.30), bevel=0.01, mat=body))
    for sx in (-1, 1):
        o.append(H.add_tube(
            f"rail_{'L' if sx < 0 else 'R'}",
            [(sx * 0.17, -0.30, 0.335), (sx * 0.17, 0.18, 0.335)],
            radius=0.012, mat=rubber,
        ))
    o.append(H.add_extrusion(
        "legshield", SHIELD_PROFILE, depth=0.40, bevel=0.015,
        location=(-0.20, 0, 0), rotation=(90, 90, 0), mat=body,
    ))
    o.append(H.add_cylinder("column", radius=0.035, depth=0.80, location=(0, -0.55, 0.68), rotation=(-12, 0, 0), mat=body))
    o.append(H.add_box("headset", size=(0.15, 0.13, 0.16), location=(0, -0.50, 1.04), bevel=0.03, mat=body))
    o.append(H.add_cylinder("speedo", radius=0.035, depth=0.025, location=(0, -0.47, 1.125), mat=darkmetal))
    o.append(H.add_cylinder("speedo_face", radius=0.028, depth=0.005, location=(0, -0.47, 1.14), mat=lampglass))
    o.append(H.add_tube(
        "handlebar",
        [(-0.26, -0.52, 1.10), (0, -0.50, 1.12), (0.26, -0.52, 1.10)],
        radius=0.016, mat=steel,
    ))
    for side, name in ((-1, "grip_L"), (1, "grip_R")):
        o.append(H.add_cylinder(name, radius=0.022, depth=0.12, location=(side * 0.28, -0.52, 1.10), rotation=(0, 90, 0), mat=rubber))
        o.append(H.add_box(
            name.replace("grip", "lever"), size=(0.09, 0.014, 0.010),
            location=(side * 0.235, -0.545, 1.088), mat=steel,
        ))
    for side, name in ((-1, "mirror_L"), (1, "mirror_R")):
        o.append(H.add_tube(name + "_stalk", [(side * 0.24, -0.52, 1.10), (side * 0.30, -0.54, 1.26)], radius=0.008, mat=steel))
        o.append(H.add_cylinder(name, radius=0.04, depth=0.012, location=(side * 0.30, -0.54, 1.28), rotation=(90, 20, 0), mat=chrome))
    o.append(H.add_tube(
        "cable", [(0.03, -0.50, 1.02), (0.05, -0.54, 0.75), (0.04, -0.52, 0.50)],
        radius=0.006, mat=darkmetal,
    ))
    o.append(H.add_sphere("headlamp", radius=0.07, scale=(1, 0.7, 1), location=(0, -0.615, 0.88), mat=lampglass))
    o.append(H.add_box("cowl", size=(0.42, 0.66, 0.44), location=(0, 0.48, 0.47), bevel=0.10, mat=body))
    for z in (0.50, 0.545, 0.59):
        for sx in (-1, 1):
            o.append(H.add_box(f"vent_{sx}_{z}", size=(0.006, 0.11, 0.016), location=(sx * 0.2115, 0.55, z), mat=rubber))
    for sx in (-1, 1):
        o.append(H.add_cylinder(f"latch_{sx}", radius=0.016, depth=0.012, location=(sx * 0.212, 0.32, 0.52), rotation=(0, 90, 0), mat=chrome))
    o.append(H.add_text("badge", "PX 150", 0.055, 0.002, location=(0.213, 0.50, 0.40), rotation=(90, 90, 0), mat=chrome))
    o.append(H.add_box("seat", size=(0.30, 0.46, 0.12), location=(0, 0.45, 0.72), bevel=0.05, mat=leather))
    for sx in (-1, 1):
        o.append(H.add_tube(f"rack_side_{sx}", [(sx * 0.11, 0.70, 0.80), (sx * 0.11, 0.88, 0.80)], radius=0.01, mat=darkmetal))
        o.append(H.add_tube(f"rack_leg_{sx}", [(sx * 0.11, 0.72, 0.80), (sx * 0.11, 0.72, 0.68)], radius=0.01, mat=darkmetal))
    for y in (0.70, 0.88):
        o.append(H.add_tube(f"rack_end_{y}", [(-0.11, y, 0.80), (0.11, y, 0.80)], radius=0.01, mat=darkmetal))
    o.append(H.add_cylinder("muffler", radius=0.05, depth=0.34, location=(0.10, 0.30, 0.23), rotation=(90, 0, 0), mat=darkmetal))
    o.append(H.add_box("taillight", size=(0.08, 0.03, 0.06), location=(0, 0.82, 0.55), mat=tailred))
    for sx in (-1, 1):
        o.append(H.add_box(f"stand_{sx}", size=(0.03, 0.03, 0.22), location=(sx * 0.10, 0.30, 0.11), mat=darkmetal))
    o.append(H.add_tube("stand_bar", [(-0.12, 0.30, 0.03), (0.12, 0.30, 0.03)], radius=0.015, mat=darkmetal))
    return [x for x in o if x is not None]


def main():
    objs = build()
    H.studio_lighting(target=objs, key_azimuth=30, intensity=1.0)
    cam = H.add_camera("cam_side", location=(3.2, 0.0, 0.8), target=(0, 0, 0.55), lens=85)
    H.frame_objects(cam, objs, azimuth=90, elevation=8, margin=1.12)
    os.makedirs(os.path.dirname(OUT_RENDER), exist_ok=True)
    H.set_render(resolution=(1200, 900), samples=64, percentage=100, view_transform="Khronos PBR Neutral")
    H.render_still(OUT_RENDER, background="#FFFFFF")
    os.makedirs(os.path.dirname(OUT_BLEND), exist_ok=True)
    H.save_blend(OUT_BLEND)
    os.makedirs(os.path.dirname(OUT_PUBLIC), exist_ok=True)
    shutil.copy(OUT_RENDER, OUT_PUBLIC)
    H.report()
    print("WROTE", OUT_RENDER, "->", OUT_PUBLIC)


main()
